// auth.d.ts
declare module '#auth-utils' {
  interface User {
    login: string
  }

  interface UserSession {
    // Add your own fields
  }
}

export {}
