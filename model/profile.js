const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    name:{
        
    },
    roll:{
        
    },
    mobile:{
        
    },
    dob:{

    },
    blood:{

    },
    nickname:{

    },
    favPersonality:{

    },
    pov:{

    },
    favMoment:{

    },
    favQoute:{

    },
    facebook:{

    },
    instagram:{

    },
    github:{

    },
    attendance:{
        type: Map, // Use Map data type
        of: Number, // Values should be numbers
        default: {} // Default is an empty object
    }
})

module.exports = mongoose.model('Profile',profileSchema);