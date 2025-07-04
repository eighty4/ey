export type TokenKind =
    | 'or'
    | 'pipe'
    | 'and'
    | 'ampersand'
    | 'lessThan'
    | 'lessThanEqual'
    | 'greaterThan'
    | 'greaterThanEqual'
    | 'question'
    | 'exclamation'
    | 'notEqual'
    | 'equal'
    // | 'dot'
    // | 'hyphen'
    // | 'underscore'
    // | 'comma'
    | 'leftParen'
    | 'rightParen'
    | 'leftSquareBracket'
    | 'rightSquareBracket'
    // | 'leftCurveBracket'
    // | 'rightCurveBracket'
    // | 'singleQuote'
    // | 'doubleQuote'
    | 'literalFalse'
    | 'literalTrue'
    | 'literalNull'
    | 'literalNumber'

export type Token = {
    kind: TokenKind
    start: number
    end: number
}

export class LexError extends Error {
    constructor(s: string, pos: number) {
        super(`invalid ${s} at position ${pos}`)
        this.name = this.constructor.name
    }
}

export function lex(s: string): Array<Token> {
    return new Lexer(s).tokenize()
}

class Lexer {
    // beginning of lexing token
    #posB: number = 0

    // end of lexing token
    #posE: number = 1

    // expression string
    #s: string

    // parsed tokens
    #tokens: Array<Token> = []

    constructor(s: string) {
        this.#s = s
    }

    tokenize(): Array<Token> {
        while (this.#posB < this.#s.length) {
            this.#addToken(this.#advanceToken())
        }
        return this.#tokens
    }

    #advanceToken(): TokenKind {
        this.#advanceWhitespace()
        switch (this.#s[this.#posB]) {
            case '|':
                if (this.#advanceMatch('|')) {
                    return 'or'
                } else {
                    return 'pipe'
                }
            case '&':
                if (this.#advanceMatch('&')) {
                    return 'and'
                } else {
                    return 'ampersand'
                }
            case '>':
                if (this.#advanceMatch('=')) {
                    return 'greaterThanEqual'
                } else {
                    return 'greaterThan'
                }
            case '<':
                if (this.#advanceMatch('=')) {
                    return 'lessThanEqual'
                } else {
                    return 'lessThan'
                }
            case '!':
                if (this.#advanceMatch('=')) {
                    return 'notEqual'
                } else {
                    return 'exclamation'
                }
            case '(':
                return 'leftParen'
            case ')':
                return 'rightParen'
            case '[':
                return 'leftSquareBracket'
            case ']':
                return 'rightSquareBracket'
            default:
                while (true) {
                    const c = this.#peekNext()
                    if (c === null) {
                        break
                    }
                    if (/[a-z]/.test(c)) {
                        this.#posE += 1
                        continue
                    }
                    break
                }
                switch (this.#s.substring(this.#posB, this.#posE)) {
                    case 'null':
                        return 'literalNull'
                    case 'false':
                        return 'literalFalse'
                    case 'true':
                        return 'literalTrue'
                }
                throw new LexError(this.#s[this.#posB], this.#posB)
        }
    }

    #advanceWhitespace() {
        while (this.#s[this.#posB] === ' ') {
            this.#posB++
            this.#posE++
        }
    }

    #addToken(kind: TokenKind) {
        this.#tokens.push({
            kind,
            start: this.#posB,
            end: this.#posE,
        })
        this.#posB = this.#posE
        this.#posE = this.#posB + 1
    }

    #advanceMatch(next: string): boolean {
        if (this.#match(next)) {
            this.#posE += next.length
            return true
        } else {
            return false
        }
    }

    #match(next: string): boolean {
        return this.#peek(next.length) === next
    }

    #peek(n: number): string {
        return this.#s.substring(this.#posE, this.#posE + n)
    }

    #peekNext(): string | null {
        return this.#s[this.#posE] || null
    }
}
