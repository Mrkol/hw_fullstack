package chan.orm

import javax.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore
import java.time.LocalDateTime

@Entity
data class Message(
	@Id
	@GeneratedValue
	@JsonIgnore
	val id: Long = 0,
	@ManyToOne
	@JsonIgnore
	val board: Board,
	@JsonIgnore
	@ManyToOne
	val parent: Message? = null,

	val number: Long = board.messageCount,
	val author: String = "",
	val text: String,
	val date: LocalDateTime = LocalDateTime.now()
)
