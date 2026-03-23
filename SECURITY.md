# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in DocChat, please report it responsibly by opening a private issue on GitHub or contacting the maintainer directly. Do not disclose the vulnerability publicly until a fix has been released.

## Scope

This policy covers the DocChat application code, API routes, authentication flows, and data handling. Third-party services (Supabase, Groq, Gemini) have their own security policies.

## Security Measures

- JWT validation with issuer claim verification
- Row-Level Security on all database tables
- Input sanitization and validation on all endpoints
- Rate limiting with Retry-After headers
- PDF magic bytes validation
- Prompt injection defense with document delimiters
- CSP, HSTS, X-Frame-Options, and other security headers
- Anonymous IP hashing (never stored raw)
