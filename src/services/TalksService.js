import firebase from 'firebase/app';

class TalksService {

  findAllForEdition(editionId) {
    return firebase.firestore()
      .collection('talks')
      .where('edition', '==', editionId)
      .get()
      .then(query => {
        const talks = {};
        query.forEach(doc => {
          const talkData = doc.data();
          talkData.activeOn = new Date(talkData.hour.seconds * 1000);
          talks[doc.id] = talkData;
        });
        return talks;
      });
  }

  findOne(talkId) {
    return firebase.firestore()
      .collection('talks')
      .doc(talkId)
      .get()
      .then(talk => {
        if (!talk.exists) {
          throw new Error(`Talk ${talkId} doesn't exist !!`);
        }

        const talkData = talk.data();
        talkData.hour = new Date(talkData.hour.seconds * 1000);
        return talkData;
      });
  }

  create(talk) {
    const talkToCreate = Object.assign({}, talk);
    talkToCreate.createdBy = firebase.auth().currentUser.uid;
    talkToCreate.createdAt = new Date();

    return firebase.firestore()
      .collection('talks')
      .add(talkToCreate);
  }

  createAll(talks) {
    const db = firebase.firestore();
    const batch = db.batch();

    talks.forEach(talk => {
      const talkToCreate = Object.assign({}, talk);
      talkToCreate.createdBy = firebase.auth().currentUser.uid;
      talkToCreate.createdAt = new Date();

      const ref = db.collection('talks').doc();
      batch.set(ref, talkToCreate);
    });

    return batch.commit();
  }

  update(talkId, talk) {
    const talkToUpdate = Object.assign({}, talk);
    talkToUpdate.modifiedBy = firebase.auth().currentUser.uid;
    talkToUpdate.modifiedAt = new Date();

    return firebase.firestore()
      .collection('talks')
      .doc(talkId)
      .set(talkToUpdate);
  }

  updateAll(talks) {
    const db = firebase.firestore();
    const batch = db.batch();

    Object.keys(talks).forEach(talkId => {
      const talkToUpdate = Object.assign({}, talks[talkId]);
      talkToUpdate.modifiedBy = firebase.auth().currentUser.uid;
      talkToUpdate.modifiedAt = new Date();

      const ref = db.collection('talks').doc(talkId);
      batch.set(ref, talkToUpdate);
    });

    return batch.commit();
  }

}

export default new TalksService();
