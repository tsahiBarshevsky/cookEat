import * as Yup from 'yup';

const required = 'זהו ערך חובה';

const recipeSchema = Yup.object().shape({
    name: Yup.string().required(required),
    quantity:
        Yup.number()
            .moreThan(0, 'ערך זה צריך להיות חיובי')
            .required(required)
            .typeError('ערך זה צריך להיות מספר'),
    category: Yup.string().required(required),
    time: Yup.object().shape({
        value:
            Yup.number()
                .moreThan(0, 'ערך זה צריך להיות חיובי')
                .required(required)
                .typeError('ערך זה צריך להיות מספר')
    })
});

export { recipeSchema };