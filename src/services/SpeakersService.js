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

  update(speakerId, speaker) {
    const speakerToUpdate = Object.assign({}, speaker);
    speakerToUpdate.modifiedBy = firebase.auth().currentUser.uid;
    speakerToUpdate.modifiedAt = new Date();

    return firebase.firestore()
    .collection('speakers')
    .doc(speakerId)
    .set(speakerToUpdate);
  }

}

export default new SpeakersService();
