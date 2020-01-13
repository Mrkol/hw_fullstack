package chan.orm

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface MessageRepository: CrudRepository<Message, Long> {
	fun getByBoardAndParent(board: Board, parent: Message?): List<Message>
	fun getByBoardAndNumber(board: Board, number: Long): Message?
	fun deleteByBoardAndNumber(board: Board, number: Long)
	fun getById(id: Long): Message?
}
