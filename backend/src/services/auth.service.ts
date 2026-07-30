import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";
import { RegisterInput, LoginInput, JwtPayload } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({ name, email, password: hashedPassword })
    .select("id, name, email")
    .single();

  if (error) throw new Error(error.message);

  // Generate JWT
  const token = generateToken({ userId: newUser.id, email: newUser.email });

  return { user: newUser, token };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, password")
    .eq("email", email)
    .single();

  if (error || !user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};