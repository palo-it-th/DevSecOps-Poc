/**
 * @name OWASP Top 10 vulnerabilities
 * @description Finds OWASP Top 10 vulnerabilities in JavaScript code
 * @kind problem
 * @id js/owasp-top-10
 * @problem.severity error
 * @precision high
 * @tags security
 *       external/owasp
 */

import javascript
import semmle.javascript.security.dataflow.CommandInjectionCustomizations
import semmle.javascript.security.dataflow.SqlInjectionCustomizations
import semmle.javascript.security.dataflow.DomBasedXssCustomizations
import semmle.javascript.security.dataflow.HardcodedCredentialsCustomizations

// Find command injection vulnerabilities
from DataFlow::Node source, DataFlow::Node sink, CommandInjectionCustomizations::Configuration cfg
where cfg.hasFlow(source, sink)
select sink, "Command injection from $@.", source, "user-provided value"

// Find SQL injection vulnerabilities
from DataFlow::Node source, DataFlow::Node sink, SqlInjectionCustomizations::Configuration cfg
where cfg.hasFlow(source, sink)
select sink, "SQL injection from $@.", source, "user-provided value"

// Find XSS vulnerabilities
from DataFlow::Node source, DataFlow::Node sink, DomBasedXssCustomizations::Configuration cfg
where cfg.hasFlow(source, sink)
select sink, "Cross-site scripting vulnerability from $@.", source, "user-provided value"

// Find hardcoded credentials
from DataFlow::Node source, DataFlow::Node sink, HardcodedCredentialsCustomizations::Configuration cfg
where cfg.hasFlow(source, sink)
select sink, "Hardcoded credentials in $@.", source, "this expression"
