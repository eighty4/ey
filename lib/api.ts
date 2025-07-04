import { lex } from './lex.ts'

export { LexError } from './lex.ts'

export type EyParser = {
    parse(expr: string): Promise<EyParsed>
}

export type EyParsed = {
    evaluate(): Promise<EyEvaluated>
}

export type EyEvaluated = {
    result?: boolean | number | string
}

export class EyParsers {
    static gitHubActions(): EyParser {
        return {
            parse(expression: string) {
                lex(expression)
                return Promise.resolve({
                    evaluate() {
                        return Promise.resolve({
                            result: expression,
                        })
                    },
                })
            },
        }
    }
}

export const gitHubActions = () => EyParsers.gitHubActions()
