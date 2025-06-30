export default {
  editor: {
    label: {
      en: "shadcn Slider",
      fr: "Curseur shadcn"
    },
    icon: 'fas fa-sliders-h',
    bubble: {
      icon: 'fas fa-sliders-h'
    },
    deprecated: false
  },
  properties: {
    min: {
      label: {
        en: "Minimum value",
        fr: "Valeur minimum"
      },
      type: "Number",
      defaultValue: 0,
      bindable: true,
      section: "data"
    },
    max: {
      label: {
        en: "Maximum value",
        fr: "Valeur maximum"
      },
      type: "Number",
      defaultValue: 100,
      bindable: true,
      section: "data"
    },
    step: {
      label: {
        en: "Step",
        fr: "Pas"
      },
      type: "Number",
      defaultValue: 1,
      bindable: true,
      section: "data"
    },
    disabled: {
      label: {
        en: "Disabled",
        fr: "Désactivé"
      },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
      section: "behavior"
    },
    required: {
      label: {
        en: "Required",
        fr: "Requis"
      },
      type: "OnOff",
      defaultValue: false,
      section: "validation"
    },
    label: {
      label: {
        en: "Label",
        fr: "Libellé"
      },
      type: "Text",
      defaultValue: "",
      bindable: true,
      translatable: true,
      section: "content"
    },
    helpText: {
      label: {
        en: "Help text",
        fr: "Texte d'aide"
      },
      type: "Text",
      defaultValue: "",
      bindable: true,
      translatable: true,
      section: "content"
    },
    showValue: {
      label: {
        en: "Show value",
        fr: "Afficher la valeur"
      },
      type: "OnOff",
      defaultValue: true,
      section: "appearance"
    },
    showMinMax: {
      label: {
        en: "Show min/max labels",
        fr: "Afficher les libellés min/max"
      },
      type: "OnOff",
      defaultValue: false,
      section: "appearance"
    },
    formatValue: {
      label: {
        en: "Value formatter (JS function)",
        fr: "Formateur de valeur (fonction JS)"
      },
      type: "Function",
      bindable: true,
      section: "behavior"
    },
    wewebVariable: {
      label: {
        en: "Weweb variable",
        fr: "Variable Weweb"
      },
      type: "Variable",
      bindable: true,
      section: "data"
    },
    customClasses: {
      label: {
        en: "Custom CSS classes",
        fr: "Classes CSS personnalisées"
      },
      type: "Text",
      bindable: true,
      section: "style"
    }
  },
  events: {
    change: {
      label: {
        en: "On change",
        fr: "Lors du changement"
      },
      default: null
    }
  },
  sections: {
    content: {
      label: { en: "Content", fr: "Contenu" },
      expand: true
    },
    data: {
      label: { en: "Data", fr: "Données" },
      expand: true
    },
    appearance: {
      label: { en: "Appearance", fr: "Apparence" },
      expand: false
    },
    validation: {
      label: { en: "Validation", fr: "Validation" },
      expand: false
    },
    behavior: {
      label: { en: "Behavior", fr: "Comportement" },
      expand: false
    },
    style: {
      label: { en: "Style", fr: "Style" },
      expand: false
    }
  }
}; 