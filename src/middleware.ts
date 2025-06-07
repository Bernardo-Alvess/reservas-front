import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";


const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
export const verifyToken = async (token: string) : Promise<{ id: string; email: string; type: string } | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { id: string; email: string; type: string };
  } catch {
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sessionToken')?.value || ''

  const {pathname, origin} = req.nextUrl;

  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    return NextResponse.redirect(new URL('/home', req.url));
  } else {
    console.log(decodedToken);
  }

  const isAuthorized = authorizeUser(decodedToken, pathname);

  if(!isAuthorized) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/my-reserves'
  ]
}

function authorizeUser(userInfo: any, requestedPath: string): boolean {

  const roleRequiredForPath: { [key: string]: string[] } = {
    "/dashboard": ["admin", "worker", "company"],
    "/my-reserves": ["user", "admin", "worker", "company"],
    "(restauraunt)": ["admin"]
    // Add more paths and roles as needed
  };

  const matchingPath = Object.keys(roleRequiredForPath).find(path => 
    requestedPath.startsWith(path)
  );


  if (matchingPath) {
    const rolesRequired = roleRequiredForPath[matchingPath];
    // Usa o type do usuário ao invés de authorities
    return rolesRequired.includes(userInfo.type);
  }

  // Default to false if no specific roles are required for the path
  return false;
}

export async function getUserInfoFromToken(token: string) {
  const tokenData = await jwtVerify(token, JWT_SECRET)

  const {payload} = await tokenData;

  return {
    email: payload?.email,
    id: payload?.sub,
    type: payload?.type,
  };
}