package chan.orm

import javax.persistence.*
import java.util.UUID


@Entity
data class MediaContent(
	@Column(columnDefinition="BLOB")
	val data: ByteArray,
	@Id
	val uuid: UUID = UUID.nameUUIDFromBytes(data)
)