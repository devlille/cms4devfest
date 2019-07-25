import firebase from 'firebase/app';

class EditionsService {
  findAllForCurrentUser() {
    return firebase
      .firestore()
      .collection('editions')
      .where(`members.${firebase.auth().currentUser.uid}`, '==', true)
      .get()
      .then(query => {
        const editions = {};
        query.forEach(doc => {
          const editionData = doc.data();
          editionData.date = new Date(editionData.date.seconds * 1000);
          editions[doc.id] = editionData;
        });
        return editions;
      });
  }

  findOneForCurrentUser(editionId) {
    return firebase
      .firestore()
      .collection('editions')
      .doc(editionId)
      .get()
      .then(edition => {
        if (!edition.exists) {
          throw new Error(`Edition ${editionId} doesn't exist !!`);
        }

        const editionData = edition.data();
        editionData.date = new Date(editionData.date.seconds * 1000);
        return editionData;
      });
  }

  findOneFromConferenceHall(editionId) {
    const context = { editionId };

    if (process.env.VUE_APP_CONFERENCE_HALL_STATE) {
      context.state = process.env.VUE_APP_CONFERENCE_HALL_STATE;
    }

    return firebase
      .functions()
      .httpsCallable('findOneFromConferenceHall')(context)
      .then(res => res.data);
  }

  create(edition) {
    edition.createdBy = firebase.auth().currentUser.uid;
    edition.createdAt = new Date();
    edition.members = {};
    edition.members[firebase.auth().currentUser.uid] = true;

    return firebase
      .firestore()
      .collection('editions')
      .add(edition);
  }

  update(editionId, edition) {
    edition.modifiedBy = firebase.auth().currentUser.uid;
    edition.modifiedAt = new Date();

    return firebase
      .firestore()
      .collection('editions')
      .doc(editionId)
      .set(edition);
  }
}

export default new EditionsService();
