package chan

import org.springframework.web.bind.annotation.*
import com.fasterxml.jackson.databind.ObjectMapper
import chan.BoardService
import chan.orm.Board
import chan.orm.Message


@RestController
@RequestMapping("/api")
class BoardController(
	val boardService: BoardService
) {
	private val jsonMapper = ObjectMapper();

	init {
		var boardA = Board(shortName = "a",
			name = "Раздел А",
			description = "Не очень загадочный раздел")
		boardA = boardService.boardRepository.save(boardA)
		boardService.boardRepository.save(
			Board(shortName = "b",
			name = "Раздел B",
			description = "Загадоный раздел"))
		boardService.messageRepository.save(
			Message(
			board = boardA,
			text = "Раз два раз два три"))
	}

	@PostMapping("/postMessage")
	fun postMessage(
		@RequestParam("board") board: String,
		@RequestParam("thread") thread: Long,
		@RequestParam("author") author: String?,
		@RequestBody text: String
	) {
		boardService.postMessage(text, author ?: "Anonymous", thread, board)
	}

	@PostMapping("/postThread")
	fun postThread(
		@RequestParam("board") board: String,
		@RequestParam("author") author: String?,
		@RequestBody text: String
	) {
		boardService.postMessage(text, author ?: "Anonymous", null, board)
	}

	@GetMapping("/getThreadMessages")
	fun getThreadMessages(
		@RequestParam("board") board: String,
		@RequestParam("thread") thread: Long
	): String {
		return jsonMapper.writeValueAsString(boardService.getThreadMessages(board, thread));
	}

	@GetMapping("/getBoardThreads")
	fun getBoardThreads(
		@RequestParam("board") board: String
	): String {
		return jsonMapper.writeValueAsString(boardService.getBoardThreads(board));
	}

	@GetMapping("/getBoards")
	fun getBoards(): String {
		return jsonMapper.writeValueAsString(boardService.boardRepository.findAll())
	}
}