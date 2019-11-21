package chan.orm

import javax.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
data class Board(
	@Id
	@GeneratedValue
	val id: Long = 0,
	val name: String,
	val shortName: String,
	val description: String,
	@JsonIgnore
	var messageCount: Long = 0
)
