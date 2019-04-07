import firebase from 'firebase/app';

class SpeakersService {

  findAllForEdition(editionId) {
    return firebase.firestore()
      .collection('speakers')
      .where('edition', '==', editionId)
      .get()
      .then(query => {
        const speakers = {};
        query.forEach(doc => speakers[doc.id] = doc.data());
        return speakers;
      });
  }

  findAllFromConferenceHall(editionId) {
    return firebase.functions()
      .httpsCallable('findAllSpeakersFromConferenceHall')({ editionId })
      .then(res => res.data);
  }

  findOne(speakerId) {
    return firebase.firestore()
      .collection('speakers')
      .doc(speakerId)
      .get()
      .then(speaker => {
        if (!speaker.exists) {
          throw new Error(`Speaker ${speakerId} doesn't exist !!`);
        }

        return speaker.data();
      });
  }

  create(speaker) {
    const speakerToCreate = Object.assign({}, speaker);
    speakerToCreate.createdBy = firebase.auth().currentUser.uid;
    speakerToCreate.createdAt = new Date();

    return firebase.firestore()
      .collection('speakers')
      .add(speakerToCreate);
  }

  createAll(speakers) {
    const db = firebase.firestore();
    const batch = db.batch();

    speakers.forEach(speaker => {
      const speakerToCreate = Object.assign({}, speaker);
      speakerToCreate.createdBy = firebase.auth().currentUser.uid;
      speakerToCreate.createdAt = new Date();

      const ref = db.collection('speakers').doc();
      batch.set(ref, speakerToCreate);
    });

    return batch.commit();
  }

  update(speakerId, speaker) {
    const speakerToUpdate = Object.assign({}, speaker);
    speakerToUpdate.modifiedBy = firebase.auth().currentUser.uid;
    speakerToUpdate.modifiedAt = new Date();

    return firebase.firestore()
      .collection('speakers')
      .doc(speakerId)
      .set(speakerToUpdate);
  }

  updateAll(speakers) {
    const db = firebase.firestore();
    const batch = db.batch();

    Object.keys(speakers).forEach(speakerId => {
      const speakerToUpdate = Object.assign({}, speakers[speakerId]);
      speakerToUpdate.modifiedBy = firebase.auth().currentUser.uid;
      speakerToUpdate.modifiedAt = new Date();

      const ref = db.collection('speakers').doc(speakerId);
      batch.set(ref, speakerToUpdate);
    });

    return batch.commit();
  }

}

export default new SpeakersService();
