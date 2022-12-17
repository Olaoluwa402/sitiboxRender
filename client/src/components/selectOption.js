const selectOption = () => {
  const genderOptions = [
    {
      label: "select",
      value: "",
    },
    {
      label: "Male",
      value: "Male",
    },
    {
      label: "Female",
      value: "Female",
    },
  ];

  const mailOptions = [
    {
      label: "select",
      value: "",
    },
    {
      label: "patients",
      value: "patients",
    },
    {
      label: "doctors",
      value: "doctors",
    },
  ];

  const bankOptions = [
    {
      label: "Access Bank ",
      value: "Access Bank ",
    },
    {
      label: "Diamond Bank Nigeria",
      value: "Diamond Bank Nigeria",
    },
    {
      label: "Ecobank Nigeria",
      value: "Ecobank Nigeria",
    },
    {
      label: "FIRSTBANK Nigeria",
      value: "FIRSTBANK Nigeria",
    },
    {
      label: "Union Bank of Nigeria",
      value: "Union Bank of Nigeria",
    },
    {
      label: "Fidelity Bank",
      value: "Fidelity Bank",
    },
    {
      label: "Guarantee Trust Bank",
      value: "Guarantee Trust Bank",
    },
    {
      label: "Stanbic IBTC",
      value: "Stanbic IBTC",
    },
    {
      label: "United Bank for Africa",
      value: "United Bank for Africa",
    },
    {
      label: "Zenith Bank",
      value: "Zenith Bank",
    },
  ];

  const specialtyOptions = [
    {
      label: "Primare Care Doctor",
      value: "Primare Care Doctor",
    },
    {
      label: "Allergy & Immunology",
      value: "Allergy & Immunology",
    },
    {
      label: "Anaesthesiology",
      value: "Anaesthesiology",
    },
    {
      label: "Dermatolgy",
      value: "Dermatolgy",
    },
    {
      label: "Diagnostic Radiology",
      value: "Diagnostic Radiology",
    },
    {
      label: "Emergency Medicine",
      value: "Emergency Medicine",
    },
    {
      label: "Dentist",
      value: "Dentist",
    },
    {
      label: "Family Medicine",
      value: "Family Medicine",
    },
    {
      label: "Internal Medicine",
      value: "Internal Medicine",
    },
    {
      label: "Medical Genetics",
      value: "Medical Genetics",
    },
    {
      label: "Neurology",
      value: "Neurology",
    },
    {
      label: "Nuclear Medicine",
      value: "Nuclear Medicine",
    },
    {
      label: "Obstetrics & Gynecology",
      value: "Obstetrics & Gynecology",
    },
    {
      label: "Ophthalmology",
      value: "Ophthalmology",
    },
    {
      label: "Pathology",
      value: "Pathology",
    },
    {
      label: "Paediatrics",
      value: "Paediatrics",
    },
    {
      label: "Physical medicine & Rehabilitation",
      value: "Physical medicine & Rehabilitation",
    },
    {
      label: "Preventive Medicine",
      value: "Preventive Medicine",
    },
    {
      label: "Psychiatry",
      value: "Psychiatry",
    },
    {
      label: "Radiation Oncology",
      value: "Radiation Oncology",
    },
    {
      label: "Surgery",
      value: "Surgery",
    },
    {
      label: "Urology",
      value: "Urology",
    },
  ];

  const paymentPatternOptions = [
    {
      label: "Daily",
      value: "Daily",
    },
    {
      label: "Weekly",
      value: "Weekly",
    },
    {
      label: "Bi-Weekly",
      value: "Bi-Weekly",
    },
    {
      label: "Monthly",
      value: "Monthly",
    },
  ];

  return {
    genderOptions,
    specialtyOptions,
    bankOptions,
    mailOptions,
    paymentPatternOptions,
  };
};

export default selectOption;
