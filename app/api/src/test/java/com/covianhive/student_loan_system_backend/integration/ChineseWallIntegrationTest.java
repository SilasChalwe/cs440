// package com.covianhive.student_loan_system_backend.integration;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.MvcResult;
// import org.springframework.test.web.servlet.setup.MockMvcBuilders;
// import org.springframework.web.context.WebApplicationContext;

// import static org.assertj.core.api.Assertions.assertThat;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
// import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

// @SpringBootTest(properties = {
//         "app.jwt.secret=test-secret-key-with-at-least-32-characters",
//         "app.jwt.expiration-ms=86400000",
//         "app.allowance.monthly-cron=0 0 0 31 2 *",
//         "spring.datasource.url=jdbc:sqlite:student-loan-system.db",
//         "spring.datasource.driver-class-name=org.sqlite.JDBC",
//         "spring.sql.init.mode=always",
//         "spring.jpa.hibernate.ddl-auto=none",
//         "spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect"
// })
// class ChineseWallIntegrationTest {

//     private MockMvc mockMvc;

//     @Autowired
//     private WebApplicationContext webApplicationContext;

//     @Autowired
//     private JdbcTemplate jdbcTemplate;

//     @BeforeEach
//     void setUp() {
//         mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
//                 .apply(springSecurity())
//                 .build();
//     }

//     @Test
//     void bankCanAccessOwnStudentButNotOtherBankStudentAndDenialIsLogged() throws Exception {
//         String bankToken = loginAndGetToken("bank_zanaco", "bank123");
//         Integer deniedBefore = jdbcTemplate.queryForObject(
//                 "select count(*) from access_logs where outcome = 'DENIED' and student_id = 2",
//                 Integer.class
//         );

//         mockMvc.perform(get("/api/bank/students/1")
//                         .header("Authorization", "Bearer " + bankToken))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.id").value(1));

//         mockMvc.perform(get("/api/bank/students/2")
//                         .header("Authorization", "Bearer " + bankToken))
//                 .andExpect(status().isForbidden())
//                 .andExpect(jsonPath("$.message").value("Access blocked by Chinese Wall policy."));

//         Integer deniedAfter = jdbcTemplate.queryForObject(
//                 "select count(*) from access_logs where outcome = 'DENIED' and student_id = 2",
//                 Integer.class
//         );
//         assertThat(deniedAfter).isNotNull();
//         assertThat(deniedBefore).isNotNull();
//         assertThat(deniedAfter).isGreaterThan(deniedBefore);
//     }

//     @Test
//     void adminCanCreateAndReassignStudentWithAccessChangingByBank() throws Exception {
//         String adminToken = loginAndGetToken("admin", "admin123");
//         String zanacoToken = loginAndGetToken("bank_zanaco", "bank123");
//         String fnbToken = loginAndGetToken("bank_fnb", "bank123");
//         Long nextId = jdbcTemplate.queryForObject("select coalesce(max(id), 0) + 1 from students", Long.class);
//         String studentNumber = "S" + nextId;

//         mockMvc.perform(post("/api/admin/students")
//                         .header("Authorization", "Bearer " + adminToken)
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content(("""
//                                 {
//                                   "id": %d,
//                                   "name": "Demo Student",
//                                   "studentNumber": "%s",
//                                   "bankId": 1
//                                 }
//                                 """).formatted(nextId, studentNumber)))
//                 .andExpect(status().isCreated())
//                 .andExpect(jsonPath("$.id").value(nextId))
//                 .andExpect(jsonPath("$.bankId").value(1));

//         mockMvc.perform(get("/api/bank/students/" + nextId)
//                         .header("Authorization", "Bearer " + zanacoToken))
//                 .andExpect(status().isOk());

//         mockMvc.perform(put("/api/admin/students/" + nextId + "/bank")
//                         .header("Authorization", "Bearer " + adminToken)
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content("""
//                                 {
//                                   "bankId": 2
//                                 }
//                                 """))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.bankId").value(2));

//         mockMvc.perform(get("/api/bank/students/" + nextId)
//                         .header("Authorization", "Bearer " + zanacoToken))
//                 .andExpect(status().isForbidden());

//         mockMvc.perform(get("/api/bank/students/" + nextId)
//                         .header("Authorization", "Bearer " + fnbToken))
//                 .andExpect(status().isOk());
//     }

//     @Test
//     void adminCanRunMonthlyAllowanceBatch() throws Exception {
//         String adminToken = loginAndGetToken("admin", "admin123");

//         mockMvc.perform(post("/api/admin/monthly-allowances/run")
//                         .header("Authorization", "Bearer " + adminToken))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.processedCount").isNumber())
//                 .andExpect(jsonPath("$.skippedCount").isNumber())
//                 .andExpect(jsonPath("$.note").isString());
//     }

//     private String loginAndGetToken(String username, String password) throws Exception {
//         MvcResult result = mockMvc.perform(post("/api/auth/login")
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content("""
//                                 {
//                                   "username": "%s",
//                                   "password": "%s"
//                                 }
//                                 """.formatted(username, password)))
//                 .andExpect(status().isOk())
//                 .andReturn();

//         String content = result.getResponse().getContentAsString();
//         String marker = "\"token\":\"";
//         int start = content.indexOf(marker);
//         if (start < 0) {
//             throw new IllegalStateException("Login response did not contain token.");
//         }
//         int tokenStart = start + marker.length();
//         int tokenEnd = content.indexOf('"', tokenStart);
//         return content.substring(tokenStart, tokenEnd);
//     }
// }
