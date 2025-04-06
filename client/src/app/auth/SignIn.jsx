
import { useSigninMutation } from "../../redux/api/authApi";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner"; 

export default function SignIn() {
  const [signin, { isLoading: isSigninLoading, error: signinError }] =
    useSigninMutation();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters long")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await signin(values).unwrap();

      if (response && response.user) {
        toast.success(`Welcome ${response.user.username}!`); 
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.log("Error details:", error?.data || error?.message || error);
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4">
        <div>
          <label className="text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <Field
            type="text"
            name="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
          />
          <ErrorMessage
            name="username"
            component="div"
            className="text-red-500 text-xs italic"
          />
        </div>

        <div>
          <label className="text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <Field
            type="password"
            name="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
          <ErrorMessage
            name="password"
            component="div"
            className="text-red-500 text-xs italic"
          />
        </div>

        {signinError && (
          <p className="text-red-500 text-xs italic">{signinError?.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={isSigninLoading}
        >
          Login
        </button>
      </Form>
    </Formik>
  );
}
