/* =========================================================
   MADE EASY - PRO
   CONFIGURATION
========================================================= */


/*
  VIDEO
  ---------------------------------------------------------
  Put videos inside:

  /videos/

  Example:

  videos/digital-circuits-01.mp4

  The class becomes playable only when:

  available: true
  AND
  videoFile is present
  AND
  current time is after scheduledTime
*/


/*
  CPQ
  ---------------------------------------------------------
  Every CPQ set uses ONE PDF.

  Example:

  cpq/nt-cpq01.pdf
*/


const SUBJECTS = {

  edc:
    "Electronic Devices & Circuits",

  ss:
    "Signals & Systems",

  nt:
    "Network Theory",

  dc:
    "Digital Circuits",

  ae:
    "Analog Electronics",

  math:
    "Engineering Mathematics",

  apti:
    "General Aptitude",

  emft:
    "Electromagnetic Fields & Transmission Lines",

  comm:
    "Communication Systems",

  cs:
    "Control Systems"

};



const SITE_CONFIG = {

  instituteName:
    "MADE EASY - PRO",


  /* =======================================================
     CLASSES
  ======================================================== */

  classes: [

    {
      id:
        "math-09",

      subject:
        SUBJECTS.dc,

      title:
        "Mathematics 08 by Sagar Sir"
        ,

      scheduledTime:
        "10:45",

      videoFile:
        "videos/M10.mp4",

      description:
        "Probability and Statistics",

      available:
        true
    },


    {
      id:
        "de-01",

      subject:
        SUBJECTS.de,

      title:
        "Miscellaneous Topics by Chandan Sir",

      scheduledTime:
        "15:15",

      videoFile:
        "videos/digital.mp4",

      description:
        "A focused session covering important network theorems.",

      available:
        true
    },

/*
    {
      id:
        "ss-01",

      subject:
        SUBJECTS.ss,

      title:
        "Fourier Transform",

      scheduledTime:
        "18:00",

      videoFile:
        "",

      description:
        "Frequency-domain representation and applications.",

      available:
        false
    },


    {
      id:
        "cs-01",

      subject:
        SUBJECTS.cs,

      title:
        "Time Response Analysis",

      scheduledTime:
        "20:00",

      videoFile:
        "",

      description:
        "Transient response, steady-state error and specifications.",

      available:
        false
    }
*/
  ],
  



  /* =======================================================
     CPQ
  ======================================================== */

  cpq: [

    {
      subjectId:
        "dc",

      subject:
        SUBJECTS.dc,

      sets: [

        {
          name:
            "CPQ 01 — Number Systems",

          pdf:
            "cpq/digital-circuits-cpq01.pdf"
        },

        {
          name:
            "CPQ 02 — Combinational Logic",

          pdf:
            "cpq/digital-circuits-cpq02.pdf"
        }

      ]
    },


    {
      subjectId:
        "edc",

      subject:
        SUBJECTS.edc,

      sets: [

        {
          name:
            "CPQ 01 — Diodes",

          pdf:
            "cpq/edc-cpq01.pdf"
        }

      ]
    },


    {
      subjectId:
        "nt",

      subject:
        SUBJECTS.nt,

      sets: [

        {
          name:
            "CPQ 01 — Network Theorems",

          pdf:
            "cpq/nt-cpq01.pdf"
        }

      ]
    },


    {
      subjectId:
        "ss",

      subject:
        SUBJECTS.ss,

      sets: [

        {
          name:
            "CPQ 01 — Fourier & Laplace",

          pdf:
            "cpq/ss-cpq01.pdf"
        }

      ]
    },


    {
      subjectId:
        "cs",

      subject:
        SUBJECTS.cs,

      sets: [

        {
          name:
            "CPQ 01 — Time Response",

          pdf:
            "cpq/cs-cpq01.pdf"
        }

      ]
    }

  ]

};
