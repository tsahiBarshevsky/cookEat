import * as Yup from 'yup';

const required = 'זהו שדה חובה';

Yup.addMethod(Yup.string, 'castToNumber', function () {
    return this.transform((value) => console.log(eval(value)));
});

const recipeSchema = Yup.object().shape({
    name: Yup.string().trim().required(required),
    quantity:
        Yup.number()
            .moreThan(0, 'ערך זה צריך להיות חיובי')
            .required(required)
            .typeError('ערך זה צריך להיות מספר'),
    category: Yup.string().trim().required(required),
    time:
        Yup.object().shape({
            value:
                Yup.number()
                    .moreThan(0, 'ערך זה צריך להיות חיובי')
                    .required(required)
                    .typeError('ערך זה צריך להיות מספר')
        }),
    ingredients:
        Yup.array().of(
            Yup.object().shape({
                title: Yup.string().trim().required(`שם: ${required}`),
                amount: Yup.string().trim().required(`כמות: ${required}`),
                unit: Yup.string().trim().required(`יחידה: ${required}`)
            })
        ),
    directions:
        Yup.array().of(
            Yup.string().trim().required(required)
        )
});

export { recipeSchema };