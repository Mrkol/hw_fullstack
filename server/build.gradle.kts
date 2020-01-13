import org.gradle.api.tasks.testing.logging.TestExceptionFormat
import org.gradle.api.tasks.testing.logging.TestLogEvent
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	val kotlinVersion = "1.3.50"

	id("org.springframework.boot") version "2.2.1.RELEASE"
	id("io.spring.dependency-management") version "1.0.8.RELEASE"
	kotlin("jvm") version kotlinVersion
	kotlin("plugin.spring") version kotlinVersion
	kotlin("plugin.jpa") version kotlinVersion
}


repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa:2.2.1.RELEASE")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.10.0")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.security:spring-security-test")

	compile("org.springframework.boot:spring-boot-starter-web:2.2.1.RELEASE")
	compile("org.jetbrains.kotlin:kotlin-reflect")
	compile("com.fasterxml.jackson.core:jackson-databind:2.10.0")
	compile("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

	runtimeOnly("com.h2database:h2")
	runtimeOnly("org.springframework.boot:spring-boot-devtools:2.2.1.RELEASE")

	testImplementation("org.junit.jupiter:junit-jupiter-api")

	testCompile("org.springframework.boot:spring-boot-starter-test:2.2.1.RELEASE") {
		exclude(module = "junit")
	}
	testCompile("com.h2database:h2:1.4.200")

	testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine")
}


tasks {
	val compileReact by registering(Exec::class) {
		workingDir("../client")
		commandLine("npm", "run", "build")
	}

	val copyFrontendData by registering(Copy::class) {
		dependsOn(compileReact)

		from("../client/build") {
			include("**")
		}
		into("src/main/resources/public")
		includeEmptyDirs = false
	}

	val cleanFrontendData by registering(Delete::class) {
		delete("src/server/resources/public")
	}

	//processResources { dependsOn(copyFrontendData) }
	//clean { dependsOn(cleanFrontendData) }
}

version = "1.0.0-SNAPSHOT"

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "1.8"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()

	testLogging {
		exceptionFormat = TestExceptionFormat.FULL
		events = mutableSetOf(TestLogEvent.FAILED, TestLogEvent.PASSED, TestLogEvent.SKIPPED)
	}
}
