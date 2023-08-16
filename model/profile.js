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

    }
})

module.exports = mongoose.model('Profile',profileSchema);