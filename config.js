
/*
  MADE EASY — PRO | SITE CONFIGURATION

  Vimeo:
  For https://vimeo.com/123456789, use vimeoId: "123456789".
  Configure Vimeo privacy so your GitHub Pages domain can embed the video.

  CPQ:
  Upload PDF files into the cpq/ folder and use their relative paths.
*/

const SUBJECTS = {
  edc: "Electronic Devices & Circuits",
  ss: "Signals & Systems",
  nt: "Network Theory",
  dc: "Digital Circuits",
  ae: "Analog Electronics",
  math: "Engineering Mathematics",
  apti: "General Aptitude",
  emft: "Electromagnetic Fields & Transmission Lines",
  comm: "Communication Systems",
  cs: "Control Systems"
};

const SITE_CONFIG = {
  instituteName: "MADE EASY — PRO",

  classes: [
    {
      id: "dc-01",
      subjectId: "dc",
      subject: SUBJECTS.dc,
      title: "Sequential Logic & Counters",
      scheduledTime: "10:00",
      vimeoId: "76979871",
      description: "Flip-flops, counters and practical timing analysis.",
      available: true
    },
    {
      id: "nt-01",
      subjectId: "nt",
      subject: SUBJECTS.nt,
      title: "Network Theorems — Part 01",
      scheduledTime: "14:00",
      vimeoId: "",
      description: "A focused session covering important network theorems.",
      available: true
    },
    {
      id: "ss-01",
      subjectId: "ss",
      subject: SUBJECTS.ss,
      title: "Fourier Transform",
      scheduledTime: "18:00",
      vimeoId: "",
      description: "Frequency-domain representation and applications.",
      available: false
    },
    {
      id: "cs-01",
      subjectId: "cs",
      subject: SUBJECTS.cs,
      title: "Time Response Analysis",
      scheduledTime: "20:00",
      vimeoId: "",
      description: "Transient response, steady-state error and specifications.",
      available: false
    },
    {
      id: "edc-01",
      subjectId: "edc",
      subject: SUBJECTS.edc,
      title: "Semiconductor Diodes",
      scheduledTime: "16:00",
      vimeoId: "",
      description: "PN junction fundamentals, biasing and applications.",
      available: false
    },
    {
      id: "math-01",
      subjectId: "math",
      subject: SUBJECTS.math,
      title: "Differential Equations",
      scheduledTime: "19:00",
      vimeoId: "",
      description: "A structured revision session on core methods.",
      available: false
    }
  ],

  cpq: [
    {
      subjectId: "dc",
      subject: SUBJECTS.dc,
      sets: [
        {
          name: "CPQ 01 — Number Systems",
          pdf: "cpq/digital-circuits-cpq01.pdf"
        },
        {
          name: "CPQ 02 — Combinational Logic",
          pdf: "cpq/digital-circuits-cpq02.pdf"
        }
      ]
    },
    {
      subjectId: "edc",
      subject: SUBJECTS.edc,
      sets: [
        {
          name: "CPQ 01 — Diodes",
          pdf: "cpq/edc-cpq01.pdf"
        }
      ]
    },
    {
      subjectId: "nt",
      subject: SUBJECTS.nt,
      sets: [
        {
          name: "CPQ 01 — Network Theorems",
          pdf: "cpq/nt-cpq01.pdf"
        }
      ]
    },
    {
      subjectId: "ss",
      subject: SUBJECTS.ss,
      sets: [
        {
          name: "CPQ 01 — Fourier & Laplace",
          pdf: "cpq/ss-cpq01.pdf"
        }
      ]
    },
    {
      subjectId: "math",
      subject: SUBJECTS.math,
      sets: [
        {
          name: "CPQ 01 — Calculus",
          pdf: "cpq/math-cpq01.pdf"
        }
      ]
    },
    {
      subjectId: "comm",
      subject: SUBJECTS.comm,
      sets: [
        {
          name: "CPQ 01 — Analog Modulation",
          pdf: "cpq/comm-cpq01.pdf"
        }
      ]
    }
  ]
};
