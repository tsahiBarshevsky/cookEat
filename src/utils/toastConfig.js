import { RecipeToast, Snackbar } from "../components";

const toastConfig = {
    recipeToast: ({ props }) => (
        <RecipeToast props={props} />
    ),
    snackbar: ({ props }) => (
        <Snackbar props={props} />
    )
};

export { toastConfig };