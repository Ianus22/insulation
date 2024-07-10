const en = {
  // ---------------------------------   PAGES   ---------------------------------

  // --------------------------------- Main page ---------------------------------
  moto: "Get AI-Driven Insulation Suggestions",
  sub_moto: "Automatically and Fast",

  btn_TryItOut: "Try it out!",

  lb_SeeItClearly: "See it clearly!",
  lb_ImgInputExample: "Example image input",

  txt_AdditionalPromtExample: "I need suggestions for improving thermals and soundproofing",
  lb_AdditionalPromt: "Example additional promt",

  txt_Output: "You should install fiberglass batt insulation between the metal studs to improve thermal efficiency and soundproofing...",
  lb_Output: "Output",

  txt_ContentDescription: "Upload your wall image and get AI-powered recommendations for the best insulation materials to improve thermal efficiency and soundproofing.",

  //  --------------------------------- Tool page ---------------------------------
  lb_tl_Title: "Chats",
  btn_tl_Close: "Close",
  btn_tl_NewChat: "New chat",

  lb_tlF_ImageUpload: "Drag and drop or click here to upload an image",
  lb_tlF_Prompt: "Additional promt",

  lb_tlF_RemoveImage: "Remove Image",
  btn_tlF_Submit: "Submit",

  // --------------------------------- How To Use page ---------------------------------
  lb_htu_Title: "How to use!",
  lb_htu_Description: "On this page, you'll find a simple guide on how to use our AI to achieve your goals efficiently. Follow the steps below to get started:",

  lb_htu_step1_Title: "Step 1: Upload Image",
  lb_htu_step1_Description: "To begin, take a clear photo of the building or wall you wish to insulate. Next, easily upload the image using our drag-and-drop or upload feature.",

  lb_htu_step2_Title: "Step 2: AI Analysis",
  lb_htu_step2_Description: "Now, we begin the process. Our advanced AI model will analyze the image to determine the best insulation solution tailored to your specific needs. Rest assured, we're dedicated to providing you with the most effective and efficient results.",

  lb_htu_step3_Title: "Step 3: Receive Solution",
  lb_htu_step3_Description: "Once our work is complete, you will receive a comprehensive solution from our advanced AI model, detailing the optimal insulation options and installation recommendations. We appreciate your trust in our services and look forward to delivering exceptional results for improved energy efficiency and comfort.",

  //  --------------------------------- Subscriptions page ---------------------------------
  lb_Subscriptions: "Subscriptions",
  dlbx_SubscriptionConformation: "Are you sure you want to cancel your subscription",

  dlbx_ConfirmSubscitptionOption: "Close",
  dlbx_CancelSubscrioptionOption: "Cancel",

  lb_sb_SelectButton: "Select",

  lb_sb1_Title: "Free trial*",
  lb_sb1_Price: "€0",
  lb_sb1_Duration: "/month",
  lb_sb1_FirstChar: "3 free trials",
  lb_sb1_SecondChar: "limited result",

  lb_sb2_Title: "Monthly subscription",
  lb_sb2_Price: "€14.99",
  lb_sb2_Duration: "/month",

  lb_sb3_Title: "Annual subscription",
  lb_sb3_Price: "€99",
  lb_sb3_Duration: "/year",

  lb_sb2_sb3_FirstChar: "Unlimited conversations",
  lb_sb2_sb3_SecondChar: "Accurate and full answers",
  lb_sb2_sb3_ThirdChar: "Chat history",
  lb_sb2_sb3_FourthChar: "Continuing old chats",

  //  --------------------------------- Contacts page ---------------------------------
  lb_ct_Title: "Get in Touch",
  
  lb_ct_Adress: "Rienößlgasse 3, Wien",
  lb_ct_Telephone: "+359 58 331 24",

  lb_ctF_Title: "Leave us a message",
  lb_ctF_NamePlaceholder: "Name",
  lb_ctF_EmailPlaceholder: "Email",
  lb_ctF_MessagePlaceholder: "Write us a message here",

  lb_ctF_SubmitButton: "Submit",

  //  --------------------------------- Sign Up page ---------------------------------
  lb_sgu_Title: "Sign up",

  lb_sgu_sgi_F_Email: "Email adress",
  lb_sgu_sgi_F_Password: "Password",

  lb_sguF_PasswordRepeat: "Password again", 

  btn_sgu_SignUpButton: "Sign Up",

  lb_sgu_HaveAnAccount: "Already have an account?",
  lb_sgu_Ahref_LogIn: "Log in",

  //  --------------------------------- Sign In page ---------------------------------
  lb_sgi_Title: "Sign in to your account",

  btn_sgu_SignInButton: "Sign in",

  lb_sgi_Ahref_ForgotPassword: "Forgot passowrd?",
  lb_sgi_NotAMember: "Not a member?",

  lb_sgi_Ahref_SignUp: "Sign up",

  // --------------------------------- COMPONENTS -----------------------------

  // --------------------------------- Navbar ---------------------------------
  lb_nvb_WebLogo: "SmartInsulation",

  btn_nvb_HowToUse: "How To Use",
  btn_nvb_Subscriptions: "Subscriptions",
  btn_nvb_Contacts: "Contacs",
  btn_nvb_SignIn: "Sign in",
  btn_nvb_Logout: "Logout",

  dlbxTitle_LogoutConfirmation: "Are you sure?",
  dlbx_LogoutConfirmation: "Are you sure you want to log out",
  dlbx_ConfirmOption: "Logout",
  dlbx_CancelOption: "Cancel",

  // --------------------------------- Footer ---------------------------------
  lb_ft_WebLogo: "2024 SmartInsulation",

  btn_ft_HowToUse: "How To Use",
  btn_ft_Donations: "Donations",
  btn_ft_Subscriptions: "Subscriptions",
  btn_ft_Contacts: "Contacts",

  // --------------------------------- Spinner ---------------------------------
  lb_sp_Title: "Loading..."

} as const;

type Translations = { [TKey in keyof typeof en]: string };

export type { Translations };
export { en };

