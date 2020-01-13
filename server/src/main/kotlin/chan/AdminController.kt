package chan

import org.springframework.web.bind.annotation.*
import com.fasterxml.jackson.databind.ObjectMapper
import java.util.UUID
import java.io.InputStream

import chan.BoardService
import chan.orm.Board
import chan.orm.Message

@RestController
@RequestMapping("/api/admin")
class AdminController(
	val boardService: BoardService
) {
	@GetMapping("/deleteMessage")
	fun deleteMessage(
		@RequestParam("board") board: String,
		@RequestParam("number") number: Long
	) {
		boardService.deleteMessage(board, number)
	}

	@GetMapping("/createBoard")
	fun createBoard(
		@RequestParam("name") name: String,
		@RequestParam("shortName") shortName: String,
		@RequestParam("description") description: String
	) {
		boardService.createBoard(name, shortName, description)
	}

	@GetMapping("/deleteBoard")
	fun deleteBoard(
		@RequestParam("shortName") shortName: String
	) {
		boardService.deleteBoard(shortName)
	}
}