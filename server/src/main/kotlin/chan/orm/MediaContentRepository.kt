package chan.orm

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface MediaContentRepository: CrudRepository<MediaContent, UUID> {
	fun getByUuid(uuid: UUID): MediaContent?
	fun existsByUuid(uuid: UUID): Boolean
}
