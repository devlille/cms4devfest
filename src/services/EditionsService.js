import firebase from 'firebase/app'

class EditionsService {

  findAllForCurrentUser() {
    return firebase.firestore()
      .collection('editions')
      .where(`members.${firebase.auth().currentUser.uid}`, '==', true)
      .get()
      .then(query => {
        const editions = {};
        query.forEach(doc => editions[doc.id] = doc.data());
        return editions
      })
  }

  findOneForCurrentUser(editionId) {
    return firebase.firestore()
      .collection('editions')
      .doc(editionId)
      .get()
      .then(edition => {
        if(!edition.exists) {
          throw new Error(`Edition ${editionId} doesn't exist !!`)
        }

        return edition.data()
      })
  }

  create(edition) {
    edition.createdBy = firebase.auth().currentUser.uid;
    edition.createdAt = new Date().getTime();
    edition.members = {};
    edition.members[firebase.auth().currentUser.uid] = true;

    return firebase.firestore()
      .collection('editions')
      .add(edition)
  }

  update(editionId, edition) {
    edition.modifiedBy = firebase.auth().currentUser.uid;
    edition.modifiedAt = new Date().getTime();

    return firebase.firestore()
      .collection('editions')
      .doc(editionId)
      .set(edition)
  }

}

export default new EditionsService()
