package chan

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.AnnotationConfigApplicationContext
import org.springframework.transaction.annotation.EnableTransactionManagement
import org.springframework.data.repository.CrudRepository


@SpringBootApplication
@EnableTransactionManagement
class App {

}

fun main(args: Array<String>) {
	runApplication<App>(*args)
}

