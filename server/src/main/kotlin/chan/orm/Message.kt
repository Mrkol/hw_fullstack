package chan.orm

import javax.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime
import java.util.UUID

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
	@Column(columnDefinition="TEXT")
	val text: String,
	val tripcode: String,
	val date: LocalDateTime = LocalDateTime.now(),
	@ElementCollection
	val media: MutableList<UUID> = ArrayList<UUID>(),
	@ElementCollection
	val replies: MutableList<Long> = ArrayList<Long>()
)
