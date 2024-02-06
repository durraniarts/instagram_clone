import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInValidation as formSchema } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const session: any = await signInAccount({
        email: values.email,
        password: values.password,
      });

      // console.log(session);
      if (session.code > 300) {
        return toast.error(session.type);
      } else if (session.code === "202") {
        toast.success("Signed in successfully");
      }

      const isLoggedIn = await checkAuthUser();
      // console.log(isLoggedIn);
      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast.error("Sign in failed");
      }
    } catch (error) {
      return error;
    }
  }
  const inputRepeat = [
    { name: "Email", type: "email" },
    { name: "Password", type: "password" },
  ];

  return (
    <Form {...form}>
      <Toaster />
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base=regular mt-2">
          Welcome back!, Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full mt-4"
        >
          {inputRepeat.map(({ name, type }: any, index) => (
            <FormField
              key={index}
              control={form.control}
              name={name.toLowerCase()}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{name}</FormLabel>
                  <FormControl>
                    <Input type={type} className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="submit"
            className="shad-button_primary"
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
