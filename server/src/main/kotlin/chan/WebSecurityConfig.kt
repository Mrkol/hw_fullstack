package chan

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder


@Configuration
@EnableWebSecurity
class SecurityConfig: WebSecurityConfigurerAdapter() {
	override fun configure(http: HttpSecurity) {
		http.authorizeRequests()
				.antMatchers("/api/admin/**").access("hasRole('ADMIN')")
				.antMatchers("/").permitAll()
				.and()
			.httpBasic()

        http.csrf().disable();
	}

	override fun configure(auth: AuthenticationManagerBuilder) {
			auth.inMemoryAuthentication()
				.withUser("admin")
				.password("{noop}admin")
				.roles("ADMIN")
	}
}
