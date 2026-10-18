
"use strict";

window.APP_CONFIG = {
  instituteName: "MADE EASY",
  timeZone: "Asia/Kolkata",

  subjects: [
    { id: "edc", name: "Electronic Devices & Circuits", shortName: "EDC" },
    { id: "ss", name: "Signals & Systems", shortName: "Signals & Systems" },
    { id: "nt", name: "Network Theory", shortName: "Network Theory" },
    { id: "dc", name: "Digital Circuits", shortName: "Digital Circuits" },
    { id: "ae", name: "Analog Electronics", shortName: "Analog Electronics" },
    { id: "math", name: "Engineering Mathematics", shortName: "Mathematics" },
    { id: "aptitude", name: "General Aptitude", shortName: "Aptitude" },
    { id: "emft", name: "Electromagnetic Fields", shortName: "EMFT" },
    { id: "comm", name: "Communication Systems", shortName: "Communication" },
    { id: "control", name: "Control Systems", shortName: "Control Systems" }
  ],

  classes: [
    {
      id: "dc-01",
      subjectId: "dc",
      title: "Mathematics 12",
      description: "Calculus Class 03",
      scheduledTime: "11:00",
      vimeoId: "1237038856",
      available: true
    },
  ],

  cpqResources: [
    {
      id: "cpq-dc",
      subjectId: "dc",
      title: "Digital Circuits",
      description: "Practice questions",
      file: "cpq/digital-circuits-cpq01.pdf"
    },
    {
      id: "cpq-edc",
      subjectId: "edc",
      title: "Electronic Devices & Circuits",
      description: "Practice questions",
      file: "cpq/edc-cpq01.pdf"
    },
    {
      id: "cpq-nt",
      subjectId: "nt",
      title: "Network Theory",
      description: "Practice questions",
      file: "cpq/nt-cpq01.pdf"
    },
    {
      id: "cpq-ss",
      subjectId: "ss",
      title: "Signals & Systems",
      description: "Practice questions",
      file: "cpq/signals-systems-cpq01.pdf"
    },
    {
      id: "cpq-math",
      subjectId: "math",
      title: "Engineering Mathematics",
      description: "Practice questions",
      file: "cpq/mathematics-cpq01.pdf"
    },
    {
      id: "cpq-ae",
      subjectId: "ae",
      title: "Analog Electronics",
      description: "Practice questions",
      file: "cpq/analog-electronics-cpq01.pdf"
    }
  ]
};
