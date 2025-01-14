import Joi from 'joi';

class UserValidation {
    static userSchema = Joi.object({
        name: Joi.string().trim().required().messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),

        email: Joi.string()
            .email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } })
            .trim()
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),

        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        }),

        confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
            'any.only': 'Passwords must match',
            'string.empty': 'Confirm Password is required'
        })
    });

    static loginSchema = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } })
            .trim()
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),

        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
    });

    static otpSchema = Joi.object({
        otp: Joi.number().integer().optional().messages({
            'number.base': 'OTP must be a number',
            'number.integer': 'OTP must be an integer'
        })
    });
    static validate = (data: any, type: 'registration' | 'login' = 'registration') => {
        // Select the appropriate schema based on the type
        const schema = type === 'login' ? this.loginSchema : this.userSchema;

        const { error, value } = schema.validate(data, {
            abortEarly: false,
            allowUnknown: true
        });

        if (error) {
            const validationError = error.details.map((err) => ({
                field: err.path[0],
                message: err.message.replace(/^"(.*)" /, ' ').replace(/\s*is\s*/, ' ')
            }));
            throw new ValidationError('Validation Failed', validationError);
        }

        return value;
    };

    static validateOtp = (data: any) => {
        const { error, value } = this.otpSchema.validate(data, {
            abortEarly: false,
            allowUnknown: true
        });

        if (error) {
            const validationError = error.details.map((err) => ({
                field: err.path[0],
                message: err.message.replace(/^"(.*)" /, ' ').replace(/\s*is\s*/, ' ')
            }));
            throw new ValidationError('Validation Failed', validationError);
        }

        return value;
    }
}

// Custom Validation Error
class ValidationError extends Error {
    errors: any[];

    constructor(message: string, errors: any[]) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

export { UserValidation, ValidationError };
