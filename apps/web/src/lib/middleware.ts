import { NextRequest, NextResponse } from "next/server";
import { extractToken, verifyToken } from "./auth";

export interface AuthenticatedRequest extends NextRequest {
  userId?: number;
  userEmail?: string;
  userRole?: string;
}

// Middleware pour vérifier l'authentification
export async function requireAuth(request: NextRequest): Promise<{ 
  authenticated: boolean; 
  userId?: number; 
  userEmail?: string;
  userRole?: string;
  response?: NextResponse;
}> {
  const authHeader = request.headers.get("Authorization");
  const token = extractToken(authHeader);

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: "Token manquant. Veuillez vous connecter." },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: "Token invalide ou expiré. Veuillez vous reconnecter." },
        { status: 401 }
      ),
    };
  }

  return {
    authenticated: true,
    userId: payload.userId,
    userEmail: payload.email,
    userRole: payload.role,
  };
}

// Middleware pour vérifier le rôle admin
export async function requireAdmin(request: NextRequest): Promise<{ 
  authenticated: boolean; 
  isAdmin: boolean;
  userId?: number;
  response?: NextResponse;
}> {
  const auth = await requireAuth(request);

  if (!auth.authenticated) {
    return { authenticated: false, isAdmin: false, response: auth.response };
  }

  if (auth.userRole !== "admin") {
    return {
      authenticated: true,
      isAdmin: false,
      response: NextResponse.json(
        { success: false, error: "Accès refusé. Droits administrateur requis." },
        { status: 403 }
      ),
    };
  }

  return {
    authenticated: true,
    isAdmin: true,
    userId: auth.userId,
  };
}