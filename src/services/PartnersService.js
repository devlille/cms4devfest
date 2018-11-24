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

  findOne(partnerId) {
    return firebase.firestore()
      .collection('partners')
      .doc(partnerId)
      .get()
      .then(partner => {
        if(!partner.exists) {
          throw new Error(`Partner ${partnerId} doesn't exist !!`)
        }

        return partner.data()
      })
  }

  uploadLogo(partner, logo) {
    const extension = logo.name.split('.').pop();

    const metadata = {};
    metadata.createdBy = firebase.auth().currentUser.uid;

    return firebase.storage().ref()
      .child(`editions/${partner.edition}/partners/${partner.name}.${extension}`)
      .put(logo, metadata);
  }

  create(partner) {
    partner.createdBy = firebase.auth().currentUser.uid;
    partner.createdAt = new Date().getTime();
    partner.activeOn = partner.activeOn.getTime();

    return firebase.firestore()
      .collection('partners')
      .add(partner)
  }

  update(partnerId, partner) {
    partner.modifiedBy = firebase.auth().currentUser.uid;
    partner.modifiedAt = new Date().getTime();
    partner.activeOn = partner.activeOn.getTime();

    return firebase.firestore()
      .collection('partners')
      .doc(partnerId)
      .set(partner)
  }

}

export default new PartnersService()
