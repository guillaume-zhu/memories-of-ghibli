import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,   // obligatoire
        unique: true,     // pas deux joueurs avec le même email
        lowercase: true,  // on stocke toujours en minuscules
        trim: true        // on supprime les espaces au début/fin
    },
    password: {
        type: String,
        required: true    // obligatoire (sera hashé avant stockage)
    }
}, {
    timestamps: true      // ajoute automatiquement createdAt et updatedAt
})

export default mongoose.model('User', userSchema)
