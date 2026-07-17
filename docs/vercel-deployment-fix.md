# Vercel Deployment Fix - July 2, 2026

## Problem
All recent deployments to Vercel were failing with build errors. Multiple commits failed to deploy:
- Portfolio slideshow fixes
- Documentation cleanup  
- Groq API integration
- Various chatbot improvements

## Root Cause
There were TWO issues causing the deployment failures:

### 1. TypeScript Compilation Error
TypeScript error in `app/api/chat/route.ts`:

```typescript
// ❌ BEFORE - locale was scoped only inside the try block
export async function POST(req: Request) {
  try {
    const { message, locale } = await req.json();
    // ... rest of code
  } catch (error) {
    // ❌ ERROR: locale is not accessible here
    return Response.json({
      reply: locale === "fa" ? "..." : "...",
    });
  }
}
```

The `locale` variable was destructured inside the `try` block, making it unavailable in the `catch` block where it was referenced for error messages.

### 2. Build Configuration Issue
The build script in `package.json` was using the `--webpack` flag:

```json
"scripts": {
  "build": "next build --webpack"
}
```

This flag forces Next.js to use webpack instead of the default Turbopack bundler in Next.js 16.x. While this works locally, it causes compatibility issues in Vercel's optimized build environment, resulting in rapid build failures (19-38 seconds).

## Solution

### Fix 1: TypeScript Scope Error
Moved `locale` declaration to the function scope level:

```typescript
// ✅ AFTER - locale is accessible throughout the function
export async function POST(req: Request) {
  let locale = "en"; // default locale at function scope
  
  try {
    const body = await req.json();
    const { message, locale: requestLocale } = body;
    locale = requestLocale || "en"; // update locale if provided
    // ... rest of code
  } catch (error) {
    // ✅ OK: locale is accessible here
    return Response.json({
      reply: locale === "fa" ? "..." : "...",
    });
  }
}
```

### Fix 2: Build Configuration
Removed the `--webpack` flag to use Next.js 16.x's default Turbopack bundler:

```json
// ✅ AFTER - Use default Turbopack
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

This allows Vercel to use its optimized build pipeline with Turbopack, which is faster and more reliable.

## Changes Made
1. **Fixed TypeScript scope error** in chat API route (`app/api/chat/route.ts`)
2. **Removed `--webpack` flags** from build scripts in `package.json` 
3. **Reinstalled dependencies** to fix corrupted `@next/swc-darwin-arm64` binary
4. **Verified the build passes locally** with Turbopack - all 31 pages generate successfully
5. **Committed and pushed fixes** to trigger new Vercel deployments

## Verification
- ✅ Local build passes without errors
- ✅ TypeScript type checking passes
- ✅ All 31 pages generate successfully
- ✅ API routes compile correctly
- 🔄 Vercel deployment triggered automatically on push

## Next Steps
- Monitor Vercel dashboard for successful deployment
- Test chatbot functionality in production
- **IMPORTANT**: Verify GROQ_API_KEY environment variable is set in Vercel project settings

### Setting Up Environment Variables in Vercel

The chatbot API route requires the `GROQ_API_KEY` environment variable. To set it:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your Groq API key (get one from https://console.groq.com/)
   - **Environment**: Select Production, Preview, and Development
4. Click **Save**
5. Redeploy your project (or it will auto-deploy on next push)

You can also use Vercel CLI:
```bash
vercel env add GROQ_API_KEY production
# Then paste your API key when prompted
```

## Prevention
Consider adding these checks to prevent similar issues:
1. Enable strict TypeScript in `tsconfig.json` (already enabled)
2. Add pre-commit hook to run `npm run build` before commits
3. Set up GitHub Actions for CI/CD to catch build errors before deployment
