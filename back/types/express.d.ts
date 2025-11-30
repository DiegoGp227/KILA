// Fusiona la interfaz Request del módulo 'express'
declare namespace Express {
    // Definición del objeto 'Request'
    interface Request {
        // Añade la propiedad 'file' (opcional) usando la referencia de tipo de multer
        file?: import('multer').File;
        
        // Define también la propiedad 'user' que viene de tu authMiddleware
        // Asume que tu usuario tiene un 'id' que es string o number
        user?: { id: string | number };
    }
}