import firebase from 'firebase/app'

class PartnersService {

  findAllForEdition(editionId) {
    return firebase.firestore()
      .collection('partners')
      .where('edition', '==', editionId)
      .get()
      .then(query => {
        const partners = {};
        query.forEach(doc => partners[doc.id] = doc.data());
        return partners
      })
  }

  create(partner) {
    partner.createdBy = firebase.auth().currentUser.uid;
    partner.createdAt = new Date().getTime();

    return firebase.firestore()
      .collection('partners')
      .add(partner)
  }

}

export default new PartnersService()
