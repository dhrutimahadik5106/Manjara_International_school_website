/**
 * Centralized School Contact & Communication Configuration for MIS
 */
export const schoolContact = {
  phone: "+91 94226 22990", // Official contact number
  phoneRaw: "+919422622990",
  email: "info@mis.edu.in", // Official email
  address: {
    street: "Khadgaon-Pakharsangvi Road",
    city: "Latur",
    state: "Maharashtra",
    pincode: "413531",
    full: "Khadgaon-Pakharsangvi Road, Latur, Maharashtra 413531"
  },
  udise: "27280101009",
  affiliation: "ICSE Pattern / CISCE Curriculum",
  whatsapp: {
    number: "919422622990",
    defaultMessage: encodeURIComponent(
      "Hello Manjara International School, I would like to know more about admissions."
    ),
    getDirectLink: function (customMessage) {
      const msg = customMessage ? encodeURIComponent(customMessage) : this.defaultMessage;
      return `https://wa.me/${this.number}?text=${msg}`;
    }
  }
};

export default schoolContact;
