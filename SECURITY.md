# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in Bookit 5's Arena, please email **security@fivesarena.com** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

**Please do not open public issues for security vulnerabilities.**

---

## Supported Versions

| Version | Status | Support Until |
|---------|--------|---------------|
| 0.1.x   | Current | TBD |
| < 0.1.0 | EOL | Unsupported |

---

## Security Practices

### Dependencies
- All dependencies are regularly audited
- Security updates are applied immediately
- Dependabot is enabled for automatic updates
- `npm audit` is run in CI/CD pipeline

### Code
- Input validation on all user-facing endpoints
- SQL injection prevention via parameterized queries
- XSS protection via React escaping
- CSRF tokens for state-changing operations

### Authentication
- Passwords hashed using bcryptjs
- NextAuth.js for session management
- OAuth2 support available
- Rate limiting on auth endpoints

### Data
- Sensitive data encrypted at rest (passwords, API keys)
- HTTPS enforced in production
- MongoDB connection secured with SSL/TLS
- Environment variables for secrets (never in code)

---

## Vulnerability Disclosure Timeline

- **Report Receipt:** Acknowledged within 24 hours
- **Initial Assessment:** Within 3 business days
- **Fix Development:** As urgency dictates
- **Public Disclosure:** After fix is released (90-day responsible disclosure window)

---

## Security Headers

The application includes:
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security (in production)

---

## Third-Party Security Audits

None conducted yet. Contact the team for enterprise security audit requests.

---

**Last Updated:** June 2026  
**Next Review:** December 2026