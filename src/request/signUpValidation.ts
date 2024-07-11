// import * as Yup from 'yup'

// export const signupValidation = Yup.object({
//     name : Yup.string().min(3,"minimum 3 words Required").required(),
//     email : Yup.string().email(),
//     // password: Yup.string().required('Please Enter your password').matches(/^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/,
//     //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character")
// })


import Joi from 'joi'

export const signupValidation = Joi.object({
    first_name : Joi.string().min(3).required(),
    last_name : Joi.string().min(3).required(),
    country : Joi.string().min(3).required(),
    phone : Joi.string().min(3).max(11).required(),
    email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    .messages({
        'string.email': 'Please enter a valid email address with @, .com or .net domain',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,16}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must be 6-16 characters long and can only contain letters, numbers, and the symbols !@#$%^&*',
            'any.required': 'Password is required'
        })
})

export const editProfileValidation = Joi.object({
    first_name : Joi.string().min(3),
    last_name : Joi.string().min(3),
    country : Joi.string().min(3),
    phone : Joi.string().min(3).max(11),
    email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
        'string.email': 'Please enter a valid email address with @, .com or .net domain',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,16}$'))
        
        .messages({
            'string.pattern.base': 'Password must be 6-16 characters long and can only contain letters, numbers, and the symbols !@#$%^&*',
            'any.required': 'Password is required'
        })
})