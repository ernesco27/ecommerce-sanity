interface SignInWithOAuthParams {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    name: string;
    email: string;
    username: string;
    image: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface EditUserParams {
  username: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  userId: string;
}

interface GetUserParams {
  email: string;
}

interface UploadedImage {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}

interface EditPasswordParams {
  password: string;
  newPassword: string;
  confirmPassword: string;
}
