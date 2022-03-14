import * as Yup from 'yup';

const required = 'זהו שדה חובה';

Yup.addMethod(Yup.string, 'castToNumber', function () {
    return this.transform((value) => console.log(eval(value)));
});

const recipeSchema = Yup.object().shape({
    // name: Yup.string().required(required),
    // quantity:
    //     Yup.number()
    //         .moreThan(0, 'ערך זה צריך להיות חיובי')
    //         .required(required)
    //         .typeError('ערך זה צריך להיות מספר'),
    // category: Yup.string().required(required),
    // time:
    //     Yup.object().shape({
    //         value:
    //             Yup.number()
    //                 .moreThan(0, 'ערך זה צריך להיות חיובי')
    //                 .required(required)
    //                 .typeError('ערך זה צריך להיות מספר')
    //     }),
    ingredients:
        Yup.array().of(
            Yup.object().shape({
                title: Yup.string().required(`שם: ${required}`),
                amount:
                    Yup.string()
                        .matches(/^(?:[1-9]\d*|0)?(?:\/\d+)?$/gm, 'כמות: ערך זה צריך להיות חיובי')
                        .required(`כמות: ${required}`),
                unit: Yup.string().required(`יחידה: ${required}`)
            })
        ),
    // directions:
    //     Yup.array().of(
    //         Yup.object().shape({
    //             direction: Yup.string().required(required)
    //         })
    //     )
});

export { recipeSchema };