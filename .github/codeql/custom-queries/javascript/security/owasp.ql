/**
 * @name OWASP Security Vulnerabilities
 * @description Detects common OWASP security issues
 * @kind problem
 * @problem.severity error
 * @security-severity 8.0
 * @precision high
 * @id js/owasp-vulnerabilities
 * @tags security
 *       external/cwe/cwe-200
 *       external/cwe/cwe-798
 */

import javascript
import semmle.javascript.security.dataflow.CommandInjectionQuery
import semmle.javascript.security.dataflow.SqlInjectionQuery
import semmle.javascript.security.dataflow.InsecureRandomnessQuery

from DataFlow::Node source, DataFlow::Node sink, string message
where
  // Command Injection
  exists(CommandInjection::Configuration cmdInj |
    cmdInj.hasFlow(source, sink) and
    message = "Possible command injection"
  )
  or
  // SQL Injection
  exists(SqlInjection::Configuration sqlInj |
    sqlInj.hasFlow(source, sink) and
    message = "Possible SQL injection"
  )
  or
  // Insecure Direct Object Reference
  exists(DataFlow::CallNode call |
    call.getCalleeName() = "get" and
    call.getArgument(0).toString().matches("%/users/%") and
    source = call and
    sink = call and
    message = "Possible IDOR vulnerability"
  )
  or
  // Hardcoded Credentials
  exists(DataFlow::Node node |
    node.asExpr() instanceof StringLiteral and
    node.getStringValue().regexpMatch("(?i).*(password|secret|key).*") and
    source = node and
    sink = node and
    message = "Hardcoded credential detected"
  )
select source, sink, message
