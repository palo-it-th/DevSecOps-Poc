/**
 * @name Custom OWASP Security Checks
 * @description Detects various OWASP Top 10 vulnerabilities
 * @kind problem
 * @problem.severity error
 * @security-severity 8.0
 * @precision high
 * @id js/custom-owasp-checks
 * @tags security
 */

import javascript
import semmle.javascript.security.dataflow.CommandInjection
import semmle.javascript.security.dataflow.SqlInjection
import semmle.javascript.security.dataflow.InsecureAuthentication

// Detect hardcoded credentials
from StringLiteral str
where str.getValue().regexpMatch("(?i).*(password|secret|key).*")
select str, "Possible hardcoded credential detected"

// Detect insecure direct object references
from MethodCallExpr call
where 
  call.getMethodName() = "get" and
  call.getNumArgument() = 1 and
  call.getArgument(0).toString().matches("%/users/%")
select call, "Possible Insecure Direct Object Reference (IDOR) detected"

// Detect insecure authentication
from CallExpr call
where call.getCalleeName() = "localStorage.setItem"
  and call.getArgument(0).toString().matches("%credentials%")
select call, "Storing sensitive data in localStorage is insecure"
