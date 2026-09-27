"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error("Email atau password salah.");
        return;
      }
      toast.success("Berhasil masuk");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-6" />
          </span>
          <h1 className="text-lg font-semibold tracking-tight">
            Academic Dashboard
          </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Welcome back</CardTitle>
            <CardDescription>
              Masuk untuk mengakses dashboard akademikmu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSupabaseConfigured ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="nama@email.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : null}
                    Sign In
                  </Button>
                </form>
              </Form>
            ) : (
              <p className="text-sm text-muted-foreground">
                Supabase belum dikonfigurasi. Buat file{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  .env.local
                </code>{" "}
                berdasarkan .env.local.example, lalu restart server
                development.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
