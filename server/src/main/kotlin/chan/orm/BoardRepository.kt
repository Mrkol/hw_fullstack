package chan.orm

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface BoardRepository: CrudRepository<Board, Long> {
	fun getById(id: Long): Board?
	fun getByShortName(shortName: String): Board?
}