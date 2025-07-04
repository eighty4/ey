import { afterAll, afterEach, beforeEach, expect, test } from 'bun:test'
import { lex } from './lex.ts'

test('lexing tokens', () => {
    const tokens: Record<string, Array<TokenKind>> = {
        '||': ['or'],
        '|': ['pipe'],
        '&&': ['and'],
        '&': ['ampersand'],
        '>': ['greaterThan'],
        '>=': ['greaterThanEqual'],
        '<': ['lessThan'],
        '<=': ['lessThanEqual'],
        '!': ['exclamation'],
        '!=': ['notEqual'],
        // '?': ['question'],
        // '==': ['equal'],
        // '=': ['equals'],
        // '.': ['dot'],
        // '-': ['hyphen'],
        // _: ['underscore'],
        // ',': ['comma'],
        '(': ['leftParen'],
        ')': ['rightParen'],
        '[': ['leftSquareBracket'],
        ']': ['rightSquareBracket'],
        // '{': ['leftCurveBracket'],
        // '}': ['rightCurveBracket'],
        // "'": ['singleQuote'],
        null: ['literalNull'],
        true: ['literalTrue'],
        false: ['literalFalse'],
    }
    for (const [expr, result] of Object.entries(tokens)) {
        expect(
            lex(expr).map(t => t.kind),
            `lex('${expr}')=${result}`,
        ).toStrictEqual(result)
    }
})

//'711': [],
//'-9.2': [],
//'0xff': [],
//'-2.99e-2': [],

//`'It''s open source!'`: [],
